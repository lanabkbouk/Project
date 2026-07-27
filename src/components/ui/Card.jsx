import { ImageOff } from 'lucide-react'
import Button from './Button'
import Typography from './Typography'
import { useCountUp } from '../../hooks/useCountUp'

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
  imageFallback,
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
  const safeGoalAmount = Number.isFinite(goalAmount) ? Math.max(0, goalAmount) : 0
  const safeRaisedAmount = Number.isFinite(raisedAmount) ? Math.max(0, raisedAmount) : 0
  const safeDonationsCount = Number.isFinite(donationsCount)
    ? Math.max(0, Math.floor(donationsCount))
    : 0

  return (
    <Component
      className={[
        'rounded-2xl border border-heading/10 bg-bg shadow-sm hover:shadow-md transition-all',
        'w-full overflow-hidden flex flex-col',
        className,
      ].join(' ')}
      {...props}
    >
      {/* الصورة */}
      <div className={['w-full overflow-hidden rounded-t-2xl', mediaClassName].join(' ')}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || title || 'Project image'}
            className="w-full aspect-video object-cover block"
          />
        ) : imageFallback ? (
          imageFallback
        ) : (
          <div className="flex w-full aspect-video items-center justify-center bg-heading/5 text-heading/40">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* المحتوى */}
      <div className={['px-6 py-6 flex flex-1 flex-col', contentClassName].join(' ')}>
        {title && (
          <Typography variant="h3" color="heading" className="mb-2 text-2xl font-bold">
            {title}
          </Typography>
        )}

        {description && (
          <Typography
            variant="bodySm"
            className="mb-6 text-[14px] text-body leading-relaxed"
          >
            {description}
          </Typography>
        )}

        {!hideStats && (
          <div className="mb-8 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <Typography
                variant="body"
                color="heading"
                className="text-[16px] font-bold leading-none"
              >
                Goal: {formatCurrency(safeGoalAmount)}
              </Typography>
              <Typography variant="bodySm" className="text-[13px] text-body font-medium">
                Raised: {formatCurrency(safeRaisedAmount)}
              </Typography>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Typography
                variant="body"
                color="heading"
                className="text-[16px] font-bold leading-none"
              >
                {safeDonationsCount}
              </Typography>
              <Typography variant="bodySm" className="text-[13px] text-body font-medium">
                donations
              </Typography>
            </div>
          </div>
        )}

        {/* الزر */}
        <div className="mt-auto">
          {children || (
            <Button
              variant="secondary"
              fullWidth
              onClick={onAction}
              className={[
                'py-4 rounded-xl text-[15px] font-bold uppercase tracking-wide',
                buttonClassName,
              ].join(' ')}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Component>
  )
}
