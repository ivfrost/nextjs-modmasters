'use client';
import { useLayoutEffect, useState } from 'react';

export default function useTruncatedElement(
	ref: React.RefObject<HTMLElement> | React.RefObject<null>,
) {
	if (!ref) {
		throw new Error('useTruncatedElement requires a ref');
	}

	const [isTruncated, setIsTruncated] = useState(false);
	const [isReadingMore, setIsReadingMore] = useState(false);

	useLayoutEffect(() => {
		if (!ref.current) return;
		// Initial check
		const { offsetHeight, scrollHeight } = ref.current;
		if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
			setIsTruncated(true);
		} else {
			setIsTruncated(false);
		}
	}, [ref]);

	return {
		isTruncated,
		isReadingMore,
		setIsReadingMore,
	};
}
