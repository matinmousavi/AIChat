'use client'

import { useState } from 'react'
import { Message } from '@/app/page'

interface MessageBubbleProps {
	msg: Message
	onUpdateMessage: (messageId: number, newText: string) => void
}

const MessageBubble = ({ msg, onUpdateMessage }: MessageBubbleProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [editText, setEditText] = useState(msg.text)

	const handleSave = () => {
		onUpdateMessage(msg.id, editText)
		setIsEditing(false)
	}

	const isUser = msg.sender === 'user'

	return (
		<div className={`group flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
			{isUser && (
				<button
					onClick={() => setIsEditing(true)}
					className='p-1 transition-opacity text-gray-400 group-opacity-100 cursor-pointer'
					aria-label='Edit message'
				>
					<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='h-5 w-5'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
						/>
					</svg>
				</button>
			)}
			<div dir='auto' className={`max-w-xs rounded-2xl p-3 md:max-w-md ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}>
				{isEditing ? (
					<div>
						<textarea
							value={editText}
							onChange={e => setEditText(e.target.value)}
							className='w-full rounded-md border-none bg-blue-700 p-2 text-white outline-none'
							rows={3}
						/>
						<div className='mt-2 flex justify-end space-x-2'>
							<button onClick={() => setIsEditing(false)} className='rounded px-2 py-1 text-xs font-semibold text-gray-200 hover:bg-white/10'>
								لغو
							</button>
							<button onClick={handleSave} className='rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700'>
								ذخیره
							</button>
						</div>
					</div>
				) : (
					<p className='whitespace-pre-wrap'>{msg.text}</p>
				)}
			</div>
		</div>
	)
}

export default MessageBubble
