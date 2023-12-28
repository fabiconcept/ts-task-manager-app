"use client"
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export default function DemoGrid() {
    const layouts = {
        lg: [
            { i: "a", x: 0, y: 0, w: 1, h: 1 },
            { i: "b", x: 1, y: 2, w: 1, h: 1 },
            { i: "c", x: 3, y: 0, w: 1, h: 1 },
        ],
        md: [
            { i: "a", x: 0, y: 0, w: 1, h: 1 },
            { i: "b", x: 1, y: 0, w: 1, h: 1 },
            { i: "c", x: 3, y: 0, w: 1, h: 1 },
        ],
        sm: [
            { i: "a", x: 0, y: 0, w: 1, h: 1 },
            { i: "b", x: 1, y: 0, w: 1, h: 1 },
            { i: "c", x: 3, y: 0, w: 1, h: 1 },
        ],
        xs: [
            { i: "a", x: 0, y: 0, w: 1, h: 1 },
            { i: "b", x: 1, y: 0, w: 1, h: 1 },
            { i: "c", x: 3, y: 0, w: 1, h: 1 },
        ],
        xxs: [
            { i: "a", x: 0, y: 0, w: 1, h: 1 },
            { i: "b", x: 2, y: 0, w: 1, h: 1 },
            { i: "c", x: 4, y: 0, w: 1, h: 1 },
        ],
    };
    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 3, md: 3, sm: 3, xs: 1, xxs: 1 }}
        >
            <div key="a" className="bg-theme-main grid place-items-center">1</div>
            <div key="b" className="bg-theme-main grid place-items-center">2</div>
            <div key="c" className="bg-theme-main grid place-items-center">3</div>
        </ResponsiveGridLayout>
    );
}