import { FaJava, FaJs, FaPython } from "react-icons/fa6";
import { SiCplusplus } from "react-icons/si";
export default function Language({ lang, className }) {
    if (lang === "Python") {
        return <FaPython className={"text-green-400 " + className} />
    }

    if (lang === "JavaScript") {
        return <FaJs className={"text-yellow-400 " + className} />
    }

    if (lang === "Java") {
        return <FaJava className={"text-red-400 " + className} />
    }

    if (lang === "C++") {
        return <SiCplusplus className={"text-blue-400 " + className} />
    }
}
