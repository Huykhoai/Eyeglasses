import { useRef, useState } from "react"

export const useTouchMoveTable = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const tableRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!tableRef.current) return;
        setIsDragging(true);
        setStartX(e.clientX);
        setScrollLeft(tableRef.current.scrollLeft);
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !tableRef.current) return;
        const deltaX = e.clientX - startX;
        tableRef.current.scrollLeft = scrollLeft - deltaX;
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!tableRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setScrollLeft(tableRef.current.scrollLeft);
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !tableRef.current) return;
        const deltaX = e.touches[0].clientX - startX;
        tableRef.current.scrollLeft = scrollLeft - deltaX;
    }

    const handleTouchEnd = () => {
        setIsDragging(false);
    }

    return {
        tableRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    }
}