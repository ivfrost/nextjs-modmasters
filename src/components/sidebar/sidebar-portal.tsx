'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface SidebarPortalContextValue {
	container: HTMLElement | null;
	setContainer: (element: HTMLElement | null) => void;
	hasPortalContent: boolean;
	setHasPortalContent: (value: boolean) => void;
}

const SidebarPortalContext = createContext<SidebarPortalContextValue | null>(
	null,
);

function useSidebarPortalContext() {
	const context = useContext(SidebarPortalContext);
	if (!context) {
		throw new Error(
			'Sidebar portal components must be used within SidebarPortalProvider',
		);
	}
	return context;
}

export function SidebarPortalProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [container, setContainer] = useState<HTMLElement | null>(null);
	const [hasPortalContent, setHasPortalContent] = useState(false);

	const value = useMemo(
		() => ({
			container,
			setContainer,
			hasPortalContent,
			setHasPortalContent,
		}),
		[container, hasPortalContent],
	);

	return (
		<SidebarPortalContext.Provider value={value}>
			{children}
		</SidebarPortalContext.Provider>
	);
}

export function SidebarSlot({
	fallback,
	className,
}: {
	fallback?: React.ReactNode;
	className?: string;
}) {
	const { setContainer, hasPortalContent } = useSidebarPortalContext();

	return (
		<div ref={(element) => setContainer(element)} className={className}>
			{!hasPortalContent ? fallback : null}
		</div>
	);
}

export function SidebarPortal({ children }: { children: React.ReactNode }) {
	const { container, setHasPortalContent } = useSidebarPortalContext();

	useEffect(() => {
		setHasPortalContent(true);
		return () => setHasPortalContent(false);
	}, [setHasPortalContent]);

	if (!container) {
		return null;
	}

	return createPortal(children, container);
}
