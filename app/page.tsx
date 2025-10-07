'use client'

import { useState, useEffect } from 'react'
import MessageInput from '@/components/MessageInput'
import Sidebar from '@/components/Sidebar'
import MessageBubble from '@/components/MessageBubble'
import useWindowHeight from '@/hooks/useWindowHeight'

export type Message = {
	id: number
	text: string
	sender: 'user' | 'bot'
}

export type ChatSession = {
	id: string
	title: string
	messages: Message[]
}

const AiChatPage = () => {
	const windowHeight = useWindowHeight()
	const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
	const [activeChatId, setActiveChatId] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	const handleNewChat = () => {
		const newChat: ChatSession = {
			id: Date.now().toString(),
			title: 'New Chat',
			messages: [
				{
					id: Date.now(),
					text: 'سلام چه کمکی از دستم بر میاد؟ 😊',
					sender: 'bot',
				},
			],
		}
		setChatSessions(prev => [newChat, ...prev])
		setActiveChatId(newChat.id)
		setIsSidebarOpen(false)
	}

	useEffect(() => {
		const savedChats = localStorage.getItem('aiChat-sessions')
		if (savedChats) {
			const chats: ChatSession[] = JSON.parse(savedChats)
			if (chats.length > 0) {
				setChatSessions(chats)
				setActiveChatId(chats[0].id)
			} else {
				handleNewChat()
			}
		} else {
			handleNewChat()
		}
	}, [])

	useEffect(() => {
		if (chatSessions.length > 0) {
			localStorage.setItem('aiChat-sessions', JSON.stringify(chatSessions))
		} else {
			localStorage.removeItem('aiChat-sessions')
		}
	}, [chatSessions])

	const activeChat = chatSessions.find(chat => chat.id === activeChatId)

	const handleSwitchChat = (id: string) => {
		setActiveChatId(id)
		setIsSidebarOpen(false)
	}

	const handleDeleteChat = (idToDelete: string) => {
		const remainingChats = chatSessions.filter(chat => chat.id !== idToDelete)
		setChatSessions(remainingChats)
		if (activeChatId === idToDelete) {
			if (remainingChats.length > 0) {
				setActiveChatId(remainingChats[0].id)
			} else {
				setActiveChatId(null)
				handleNewChat()
			}
		}
	}

	const sendMessage = async (history: Message[]) => {
		setIsLoading(true)
		try {
			const apiHistory = history.map(msg => ({
				role: msg.sender === 'bot' ? 'assistant' : 'user',
				content: msg.text,
			}))
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: apiHistory }),
			})
			if (!response.ok) throw new Error('Network response was not ok')
			const data = await response.json()
			const botMessage: Message = {
				id: Date.now(),
				text: data.message,
				sender: 'bot',
			}
			setChatSessions(currentSessions =>
				currentSessions.map(session => {
					if (session.id === activeChatId) {
						return { ...session, messages: [...session.messages, botMessage] }
					}
					return session
				})
			)
		} catch (error) {
			console.error('Error fetching from API:', error)
			const errorMessage: Message = {
				id: Date.now(),
				text: 'متاسفانه مشکلی پیش اومد.',
				sender: 'bot',
			}
			setChatSessions(sessions =>
				sessions.map(session => (session.id === activeChatId ? { ...session, messages: [...session.messages, errorMessage] } : session))
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleUpdateMessage = (messageId: number, newText: string) => {
		if (!activeChat) return
		const messageIndex = activeChat.messages.findIndex(msg => msg.id === messageId)
		if (messageIndex === -1) return
		const historyToResend = activeChat.messages.slice(0, messageIndex)
		const updatedUserMessage: Message = {
			...activeChat.messages[messageIndex],
			text: newText,
		}
		const updatedMessages = [...historyToResend, updatedUserMessage]
		setChatSessions(sessions => sessions.map(session => (session.id === activeChatId ? { ...session, messages: updatedMessages } : session)))
		sendMessage(updatedMessages)
	}

	const generateTitleForChat = async (chatId: string, messageText: string) => {
		try {
			const response = await fetch('/api/generate-title', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: messageText }),
			})
			if (response.ok) {
				const data = await response.json()
				setChatSessions(sessions => sessions.map(session => (session.id === chatId ? { ...session, title: data.title } : session)))
			}
		} catch (error) {
			console.error('Failed to generate title:', error)
		}
	}

	const handleSendMessage = async (text: string) => {
		if (!activeChat) return
		const isFirstUserMessage = activeChat.messages.filter(m => m.sender === 'user').length === 0
		const newUserMessage: Message = { id: Date.now(), text, sender: 'user' }
		const updatedMessages = [...activeChat.messages, newUserMessage]
		setChatSessions(sessions =>
			sessions.map(session =>
				session.id === activeChatId
					? {
							...session,
							title: isFirstUserMessage ? text.substring(0, 25) + (text.length > 25 ? '...' : '') : session.title,
							messages: updatedMessages,
					  }
					: session
			)
		)
		await sendMessage(updatedMessages)
		if (isFirstUserMessage && activeChatId) {
			generateTitleForChat(activeChatId, text)
		}
	}

	return (
		<div className='flex bg-gray-900 text-white' style={{ height: windowHeight ? `${windowHeight}px` : '100dvh' }}>
			<Sidebar
				sessions={chatSessions}
				activeChatId={activeChatId}
				onNewChat={handleNewChat}
				onSwitchChat={handleSwitchChat}
				onDeleteChat={handleDeleteChat}
				onClose={() => setIsSidebarOpen(false)}
				isOpen={isSidebarOpen}
			/>
			<div className='flex flex-grow flex-col bg-gray-700'>
				<header className='flex h-14 shrink-0 items-center border-b border-gray-600 p-4 md:hidden'>
					<button onClick={() => setIsSidebarOpen(true)}>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-6 w-6'>
							<path
								fillRule='evenodd'
								d='M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z'
								clipRule='evenodd'
							/>
						</svg>
					</button>
					<h1 className='ml-4 truncate font-semibold'>{activeChat?.title || 'AiChat'}</h1>
				</header>
				<div className='flex-grow overflow-y-auto p-4'>
					<div className='space-y-4'>
						{activeChat?.messages.map(msg => (
							<div key={msg.id} className='group'>
								<MessageBubble msg={msg} onUpdateMessage={handleUpdateMessage} />
							</div>
						))}
						{isLoading && (
							<div className='flex justify-start'>
								<div className='bg-gray-600 p-3 rounded-2xl'>
									<div className='flex items-center space-x-2'>
										<span className='w-2.5 h-2.5 bg-gray-400 rounded-full my-custom-animation'></span>
										<span className='w-2.5 h-2.5 bg-gray-400 rounded-full my-custom-animation' style={{ animationDelay: '0.2s' }}></span>
										<span className='w-2.5 h-2.5 bg-gray-400 rounded-full my-custom-animation' style={{ animationDelay: '0.4s' }}></span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<MessageInput onSendMessage={handleSendMessage} isLoading={!activeChat || isLoading} />
			</div>
		</div>
	)
}

export default AiChatPage
