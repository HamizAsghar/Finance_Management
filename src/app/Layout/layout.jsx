// "use client"
// import { usePathname } from 'next/navigation'
// import React from 'react'
// import { Footer } from '@/app/footer/page'
// import Sidebar from '@/app/sideBar/page'


// const Layout = ({ children }) => {
//     const Pathname = usePathname()
//     return (
//         <div>
//             {Pathname.startsWith("/admin") ? (
//                 <div className="flex h-screen">
//                     <div className='h-screen'>
//                         <Sidebar />
//                     </div>
//                     <div className="flex-1 overflow-auto">
//                         {children}
//                     </div>
//                 </div>
//             ) : (
//                 <div>
//                     <div>{children}</div>
//                     <Footer />
//                 </div>
//             )}
//         </div>
//     )
// }

// export default Layout








"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { Footer } from "@/app/footer/page";
import Sidebar from "@/app/sideBar/page";

const Layout = ({ children }) => {
    const Pathname = usePathname();

    return (
        <div className="flex h-screen">
            {Pathname.startsWith("/admin") ? (
                <>
                    {/* Sidebar remains fixed */}
                    <Sidebar />

                    {/* Main content scrollable */}
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </>
            ) : (
                <div className="flex flex-col min-h-screen">
                    <div className="flex-1">{children}</div>
                    <Footer />
                </div>
            )}
        </div>
    );
};

export default Layout;
