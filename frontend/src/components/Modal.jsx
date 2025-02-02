import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function Modal({ visible, onClose, title, children, icon }) {
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // Tracks the actual visibility for fading out

    useEffect(() => {
        if (visible) {
            setShowModal(true); // Add to DOM
            // Trigger fade-in effect
            setTimeout(() => setIsVisible(true), 100); // Slight delay for fade-in animation
        } else {
            // Trigger fade-out effect
            setIsVisible(false);
            // Wait for the fade-out transition to complete
            const timeout = setTimeout(() => setShowModal(false), 300); // Matches the transition duration
            return () => clearTimeout(timeout);
        }
    }, [visible]);

    if (!showModal) {
        return null; // Remove completely from DOM after fade-out
    }

    return (
        <div
            className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex justify-center items-center z-20 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
            onClick={onClose}
        >
            <div
                className={`bg-[#222222] max-w-[60vw] text-white p-4 rounded-lg min-w-[800px] transition-transform duration-300 transform ${isVisible ? "scale-100" : "scale-95"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-white/25 pb-2 mb-1 font-semibold flex items-center justify-between">
                    <p className="flex gap-2 items-center">
                        {icon && icon()}
                        {title}
                    </p>
                    <XMarkIcon
                        className="w-5 h-5 text-red-400 hover:brightness-150 duration-300 cursor-pointer"
                        onClick={onClose}
                    />
                </div>
                {children}
            </div>
        </div>
    );
}
