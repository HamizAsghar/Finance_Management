// import { NextResponse } from 'next/server';
// import Budget from '@/models/Budget';
// import { connectDb } from '@/helper/db';

// export async function PUT(request, { params }) {
//     try {
//         await connectDb();
//         const body = await request.json();
//         const budget = await Budget.findByIdAndUpdate(params.id, body, {
//             new: true,
//             runValidators: true,
//         });

//         if (!budget) {
//             return NextResponse.json(
//                 { success: false, message: 'Budget not found' },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json({ success: true, data: budget });
//     } catch (error) {
//         return NextResponse.json(
//             { success: false, message: error.message || 'Failed to update budget' },
//             { status: 400 }
//         );
//     }
// }

// // DELETE: Delete a budget by ID
// export async function DELETE(request, { params }) {
//     try {
//         await connectDb();
//         const budget = await Budget.findByIdAndDelete(params.id);

//         if (!budget) {
//             return NextResponse.json(
//                 { success: false, message: 'Budget not found' },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json({ success: true, data: {} });
//     } catch (error) {
//         return NextResponse.json(
//             { success: false, message: 'Failed to delete budget' },
//             { status: 500 }
//         );
//     }
// }




import { NextResponse } from 'next/server';
import Budget from '@/models/Budget';
import { connectDb } from '@/helper/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const body = await request.json();
        const budget = await Budget.findOneAndUpdate(
            {
                _id: params.id,
                userId: session.user.id
            },
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!budget) {
            return NextResponse.json(
                { success: false, message: 'Budget not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: budget });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to update budget' },
            { status: 400 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const budget = await Budget.findOneAndDelete({
            _id: params.id,
            userId: session.user.id
        });

        if (!budget) {
            return NextResponse.json(
                { success: false, message: 'Budget not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete budget' },
            { status: 500 }
        );
    }
}


