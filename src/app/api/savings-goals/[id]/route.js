// import { NextResponse } from 'next/server';
// import SavingsGoal from '@/models/SavingsGoal';
// import { connectDb } from '@/helper/db';

// export async function PUT(request, { params }) {
//     try {
//         await connectDb();
//         const data = await request.json();
//         const goal = await SavingsGoal.findByIdAndUpdate(params.id, data, { new: true });
//         return NextResponse.json({ success: true, data: goal });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: 'Failed to update savings goal' }, { status: 500 });
//     }
// }

// export async function DELETE(request, { params }) {
//     try {
//         await connectDb();
//         await SavingsGoal.findByIdAndDelete(params.id);
//         return NextResponse.json({ success: true });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: 'Failed to delete savings goal' }, { status: 500 });
//     }
// }





import { NextResponse } from 'next/server';
import SavingsGoal from '@/models/SavingsGoal';
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
        const data = await request.json();
        const goal = await SavingsGoal.findOneAndUpdate(
            {
                _id: params.id,
                userId: session.user.id
            },
            data,
            { new: true }
        );

        if (!goal) {
            return NextResponse.json(
                { success: false, message: 'Goal not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: goal });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update savings goal' },
            { status: 500 }
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
        const goal = await SavingsGoal.findOneAndDelete({
            _id: params.id,
            userId: session.user.id
        });

        if (!goal) {
            return NextResponse.json(
                { success: false, message: 'Goal not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete savings goal' },
            { status: 500 }
        );
    }
}

