import React from 'react'

export function useMediaQuery(query) {
	const [matches, setMatches] = React.useState(false)

	React.useEffect(() => {
		const mq = window.matchMedia(query)
		const onChange = () => setMatches(mq.matches)
		onChange()
		mq.addEventListener('change', onChange)
		return () => mq.removeEventListener('change', onChange)
	}, [query])

	return matches
}
