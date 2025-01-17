// "use client"
// import { usePathname } from 'next/navigation'
// import React from 'react'
// import Sidebar from './SideBar'
// import Navigation from './Navigation'
// import { Footer } from './Footer'

// usePathname
// const Layout = ({ children }) => {
//     const Pathname = usePathname()
//     return (
//         <div>
//             {Pathname.startsWith("/admin") ?
//                 (<div>
//                     <div className='flex h-screen'>
//                         <Sidebar/>
//                         {children}
//                     </div>
//                 </div>) : (
//                     <div>

//                         {children}
//                         <Footer/>
//                     </div>
//                 )}
//         </div>
//     )
// }

// export default Layout

"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import { Footer } from '../app/footer/page'
import Sidebar from '@/app/sideBar/page'


const Layout = ({ children }) => {
    const Pathname = usePathname()
    return (
        <div>
            {Pathname.startsWith("/admin") ? (
                <div className="flex h-screen">
                <div className='h-screen'>
                   <Sidebar/>
                </div>
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </div>
            ) : (
                <div>
                    <div>{children}</div>
                    <Footer/>
                </div>
            )}
        </div>
    )
}

export default Layout
