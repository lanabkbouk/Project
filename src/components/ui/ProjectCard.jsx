import Card from './Card'

export default function ProjectCard({
  title,
  description,
  imageSrc,
  imageAlt,
  progress = 0,
  actionLabel = 'View Details',
  onAction,
  className = '',
  contentClassName = '',
  buttonClassName = '',
  children,
  ...props
}) {
  return (
    <Card
      variant="project"
      title={title}
      description={description}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      progress={progress}
      actionLabel={actionLabel}
      onAction={onAction}
      className={className}
      contentClassName={contentClassName}
      buttonClassName={buttonClassName}
      {...props}
    >
      {children}
    </Card>
  )
}