const themes = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    danger: "bg-red-500 text-white",
}

export default function Button({ variant, className, children, onClick }) {
    return <button className={`py-2 px-4 text-sm rounded-md shadow-md hover:brightness-75 duration-300 ${themes[variant]} ${className}`} onClick={onClick}>{children}</button>
}
