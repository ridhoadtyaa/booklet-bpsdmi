import HTMLFlipBook from 'react-pageflip'
import React from 'react'
import { useMediaQuery } from '../hooks/use-media-query'

const modules = import.meta.glob('/public/images/*.png', {
	eager: true,
})

const images = Object.keys(modules)
	.sort((a, b) => {
		const na = Number(a.match(/(\d+)\.png$/)[1])
		const nb = Number(b.match(/(\d+)\.png$/)[1])
		return na - nb
	})
	.map(image => image.replace('/public', ''))

function Book() {
	const bookRef = React.useRef(null)

	const totalPages = images.length
	const [page, setPage] = React.useState(1) // 1-based (buat manusia)
	const [inputPage, setInputPage] = React.useState('1')

	const onFlip = e => {
		// e.data = page index (0-based)
		const current = (e && e.data != null ? e.data : 0) + 1
		setPage(current)
		setInputPage(String(current))
	}

	const flipTo = targetPage1Based => {
		const safe = Math.min(Math.max(targetPage1Based, 1), totalPages)
		bookRef.current?.pageFlip()?.flip(safe - 1) // balik ke 0-based
	}

	const prev = () => {
		bookRef.current?.pageFlip()?.flipPrev()
	}

	const next = () => {
		bookRef.current?.pageFlip()?.flipNext()
	}

	const submitGoTo = e => {
		e.preventDefault()
		const n = Number(inputPage)
		if (Number.isNaN(n)) return
		flipTo(n)
	}

	const isSmall = useMediaQuery('(max-width: 600px)')
	console.log(isSmall)

	const BASE_W = 595
	const BASE_H = 420
	const RATIO = BASE_H / BASE_W // keep proportions

	// “dikurangin dikit” pas kecil
	const width = isSmall ? 350 : BASE_W
	const height = Math.round(width * RATIO)
	console.log(width)

	return (
		<>
			<div className="container">
				<HTMLFlipBook
					width={width}
					height={height}
					maxShadowOpacity={0.5}
					drawShadow={true}
					showCover={true}
					size="fixed"
					ref={bookRef}
					onFlip={onFlip}
				>
					{images.map(img => (
						<div className="page" key={img}>
							<img src={img} className="img-page" />
						</div>
					))}
				</HTMLFlipBook>
			</div>

			<div className="pagination-container">
				<div className="pagination">
					<button onClick={prev} disabled={page <= 1}>
						Prev
					</button>

					<div className="text-white">
						Page <b>{page}</b> / {totalPages}
					</div>

					<button onClick={next} disabled={page >= totalPages}>
						Next
					</button>
				</div>

				<div className="go-to">
					<form onSubmit={submitGoTo} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
						<label style={{ fontSize: 12 }} className="text-white">
							Go to:
						</label>
						<input value={inputPage} onChange={e => setInputPage(e.target.value)} inputMode="numeric" style={{ width: 50, padding: '4px 6px' }} />
						<button type="submit">Go</button>
					</form>
				</div>
			</div>
		</>
	)
}

export default Book
