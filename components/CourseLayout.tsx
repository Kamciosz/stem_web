"use client";

import { useState } from "react";
import { CourseNav } from "./CourseNav";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import type { CourseDetail } from "@/lib/courses";

type CourseLayoutProps = {
    course: CourseDetail;
    breadcrumbs?: Crumb[];
    children: React.ReactNode;
};

export function CourseLayout({ course, breadcrumbs, children }: CourseLayoutProps) {
    const [navCollapsed, setNavCollapsed] = useState(false);

    return (
        <div className="course-layout">
            <CourseNav course={course} collapsed={navCollapsed} onCollapsedChange={setNavCollapsed} />
            <main className={`course-layout-main ${navCollapsed ? "nav-collapsed" : ""}`}>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="course-layout-breadcrumbs">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                )}
                <div className="course-layout-content">{children}</div>
            </main>
        </div>
    );
}
