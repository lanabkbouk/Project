
import { ImageOff } from 'lucide-react'

import Button from './Button'
import Typography from './Typography'

function formatCurrency(value) {
	if (!Number.isFinite(value)) return '$0'
	return `$${Math.round(value).toLocaleString('en-US')}`
}

export default function Card({
	as: Component = 'div',
	className = '',
	children,
	title,
	description,
	imageSrc,
	imageAlt,
	goalAmount = 200000,
	raisedAmount = 8000,
	donationsCount = 6,
	actionLabel = 'View Details',
	onAction,
	hideStats = false,
	contentClassName = '',
	buttonClassName = '',
	mediaClassName = '',
	...props
}) {
	const baseClasses = ['rounded-4xl border border-slate-100 bg-white shadow-md', className]
		.filter(Boolean)
		.join(' ')

	const safeGoalAmount = Number.isFinite(goalAmount) ? Math.max(0, goalAmount) : 0
	const safeRaisedAmount = Number.isFinite(raisedAmount) ? Math.max(0, raisedAmount) : 0
	const safeDonationsCount = Number.isFinite(donationsCount)
		? Math.max(0, Math.floor(donationsCount))
		: 0

	return (
		<Component
			className={[
				baseClasses,
				'w-full overflow-hidden flex flex-col',
			]
				.filter(Boolean)
				.join(' ')}
			{...props}
		>
			<div className={['w-full overflow-hidden rounded-t-4xl', mediaClassName].filter(Boolean).join(' ')}>
				{imageSrc ? (
					<img
						src={imageSrc}
						alt={imageAlt || title || 'Project image'}
						className='w-full aspect-video object-cover block'
					/>
				) : (
					<div className='flex w-full aspect-video items-center justify-center bg-slate-100 text-slate-400'>
						<ImageOff className='h-8 w-8' aria-hidden='true' />
					</div>
				)}
			</div>

			<div className={['px-6 py-4 flex flex-1 flex-col', contentClassName].filter(Boolean).join(' ')}>
				{title ? (
					<Typography variant='h3' color='heading' className='mb-2 text-2xl'>
						{title}
					</Typography>
				) : null}

				{description ? (
					<Typography variant='bodySm' className='mb-6 text-[14px] text-gray-500 leading-relaxed'>
						{description}
					</Typography>
				) : null}

				{hideStats ? null : (
					<div className='mb-8 flex items-start justify-between'>
						<div className='flex flex-col gap-1'>
							<Typography variant='body' color='heading' className='text-[16px] font-bold leading-none'>
								Goal: {formatCurrency(safeGoalAmount)}
							</Typography>
							<Typography variant='bodySm' className='text-[13px] text-gray-400 font-medium'>
								Raised: {formatCurrency(safeRaisedAmount)}
							</Typography>
						</div>

						<div className='flex flex-col items-end gap-1'>
							<Typography variant='body' color='heading' className='text-[16px] font-bold leading-none'>
								{safeDonationsCount}
							</Typography>
							<Typography variant='bodySm' className='text-[13px] text-gray-400 font-medium'>
								donations
							</Typography>
						</div>
					</div>
				)}

				<div className='mt-auto'>
					{children || (
						<Button
							variant='secondary'
							fullWidth
							onClick={onAction}
							className={[
								'py-4 rounded-4xl text-[15px] font-bold hover:bg-zinc-800 uppercase tracking-wide',
								buttonClassName,
							]
								.filter(Boolean)
								.join(' ')}
						>
							{actionLabel}
						</Button>
					)}
				</div>
			</div>
		</Component>
	)
}

