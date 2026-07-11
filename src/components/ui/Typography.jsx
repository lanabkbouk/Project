const VARIANT_STYLES = {
	// Hero and section titles inspired by the provided design text specs.
	display: 'font-["Teachers"] text-4xl sm:text-5xl md:text-[56px] md:leading-[1.1] font-bold text-heading',
	sectionTitle: 'font-["Teachers"] text-3xl sm:text-4xl md:text-[50px] md:leading-[60px] font-bold text-heading',
	h1: 'font-["Teachers"] text-3xl sm:text-4xl md:text-5xl leading-tight font-bold text-heading',
	h2: 'font-["Teachers"] text-2xl sm:text-3xl md:text-4xl leading-tight font-bold text-heading',
	h3: 'font-["Teachers"] text-xl sm:text-2xl md:text-3xl leading-snug font-bold text-heading',
	h4: 'font-["Teachers"] text-lg sm:text-xl md:text-2xl leading-snug font-semibold text-heading',
	h5: 'font-["Teachers"] text-base sm:text-lg md:text-xl leading-normal font-semibold text-heading',
	h6: 'font-["Teachers"] text-sm sm:text-base md:text-lg leading-normal font-semibold text-heading',
	subtitle: 'font-["Teachers"] text-xl md:text-2xl leading-tight font-bold text-primary capitalize',
	lead: 'font-["Estedad"] text-base md:text-lg leading-relaxed text-body',
	body: 'font-["Estedad"] text-base leading-6 text-body',
	bodySm: 'font-["Estedad"] text-sm leading-5 text-body',
	caption: 'font-["Estedad"] text-xs leading-4 text-body',
	overline: 'font-["Estedad"] text-xs leading-4 uppercase tracking-[0.12em] text-body',
}

const COLOR_STYLES = {
	inherit: '',
	primary: 'text-primary',
	heading: 'text-heading',
	body: 'text-body',
	black: 'text-black',
	white: 'text-white',
	danger: 'text-danger',
	muted: 'text-gray-600',
}

const ALIGN_STYLES = {
	inherit: '',
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
	justify: 'text-justify',
}

const WEIGHT_STYLES = {
	normal: '',
	medium: 'font-medium',
	semibold: 'font-semibold',
	bold: 'font-bold',
	extrabold: 'font-extrabold',
}

function resolveElement(variant) {
	const map = {
		display: 'h1',
		sectionTitle: 'h2',
		subtitle: 'h3',
		lead: 'p',
		body: 'p',
		bodySm: 'p',
		caption: 'span',
		overline: 'span',
		h1: 'h1',
		h2: 'h2',
		h3: 'h3',
		h4: 'h4',
		h5: 'h5',
		h6: 'h6',
	}

	return map[variant] || 'p'
}

export default function Typography({
	variant = 'body',
	as,
	children,
	className = '',
	color = 'inherit',
	align = 'inherit',
	weight = 'normal',
	gutterBottom = false,
	truncate = false,
	...props
}) {
	const elementTag = as || resolveElement(variant)

	const classes = [
		VARIANT_STYLES[variant] || VARIANT_STYLES.body,
		COLOR_STYLES[color] || '',
		ALIGN_STYLES[align] || '',
		WEIGHT_STYLES[weight] || '',
		gutterBottom ? 'mb-4' : '',
		truncate ? 'truncate overflow-hidden whitespace-nowrap' : '',
		className,
	]
		.filter(Boolean)
		.join(' ')

	return createElement(elementTag, { className: classes, ...props }, children)
}
import { createElement } from 'react'
