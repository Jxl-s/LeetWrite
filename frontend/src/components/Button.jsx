const themes = {
    primary: "bg-primary text-white"
}

export default function Button({ variant, className, children }) {
    return <button className={`py-2 px-4 text-sm rounded-md shadow-md hover:brightness-75 duration-300 ${themes[variant]} ${className}`}>{children}</button>
}
