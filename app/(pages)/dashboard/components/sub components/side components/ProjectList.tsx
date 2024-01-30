import Project from "./Project";

export default function ProjectList() {
    return (
        <div className="flex-1 h-full overflow-y-auto flex flex-col gap-1 relative">
            <p className="text-sm opacity-50 sticky top-0 mb-2">Projects</p>
            <Project />
            <Project />
            <Project />
            <Project />
            <Project />
            <Project />
            <Project />
            <Project />
            <Project />
            <Project />
        </div>
    );
}