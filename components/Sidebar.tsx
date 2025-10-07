// file: components/Sidebar.tsx

'use client'

import { ChatSession } from '@/app/page'

interface SidebarProps {
	isOpen: boolean
	sessions: ChatSession[]
	activeChatId: string | null
	onNewChat: () => void
	onSwitchChat: (id: string) => void
	onDeleteChat: (id: string) => void
	onClose: () => void
}

const Sidebar = ({ isOpen, sessions, activeChatId, onNewChat, onSwitchChat, onDeleteChat, onClose }: SidebarProps) => {
	return (
		<>
			<div
				className={`fixed inset-0 z-10 bg-black/50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
				onClick={onClose}
			/>

			<div
				className={`fixed top-0 left-0 z-20 flex h-full w-64 transform flex-col bg-gray-800 p-2 transition-transform md:relative md:translate-x-0 ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<button onClick={onNewChat} className='mb-2 w-full rounded-lg bg-emerald-600 p-2 font-bold text-white hover:bg-emerald-700'>
					+ New Chat
				</button>

				<div className='flex-grow overflow-y-auto pr-2'>
					<h2 className='mb-2 px-2 text-sm font-semibold text-gray-400'>Chat History</h2>
					<nav className='flex flex-col space-y-1'>
						{sessions.map(chat => (
							<div key={chat.id} className='group relative flex items-center justify-between rounded-md hover:bg-gray-700'>
								<button
									onClick={() => {
										onSwitchChat(chat.id)
										onClose()
									}}
									className={`w-full truncate p-2 text-left text-sm font-medium ${chat.id === activeChatId ? 'text-white' : 'text-gray-300'}`}
								>
									{chat.title}
								</button>
								<button
									onClick={() => onDeleteChat(chat.id)}
									className='p-1 transition-opacity text-red-400 group-opacity-100 cursor-pointer'
									aria-label='Delete chat'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										strokeWidth={1.5}
										stroke='currentColor'
										className='h-5 w-5'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
										/>
									</svg>
								</button>
							</div>
						))}
					</nav>
				</div>
			</div>
		</>
	)
}

export default Sidebar
