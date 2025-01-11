// import { connectDb } from "@/helper/db";
// import Expense from "@/models/Expense";
// import { NextResponse } from "next/server";

// // Update Expense By ID
// export async function PUT(request, { params }) {
//     try {
//         await connectDb();
//         const { id } = params;
//         const { amount, category, description, date } = await request.json();

//         if (!id) {
//             return NextResponse.json(
//                 { message: 'Expense ID is required.', success: false },
//                 { status: 400 }
//             );
//         }

//         const expense = await Expense.findById(id);
//         if (!expense) {
//             return NextResponse.json(
//                 { message: 'Expense not found.', success: false },
//                 { status: 404 }
//             );
//         }

//         expense.amount = amount || expense.amount;
//         expense.category = category || expense.category;
//         expense.description = description || expense.description;
//         expense.date = date || expense.date;

//         const updatedExpense = await expense.save();

//         return NextResponse.json(
//             { message: 'Expense updated successfully', success: true, data: updatedExpense },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error('Error updating expense:', error);
//         return NextResponse.json(
//             { message: 'Failed to update expense', success: false },
//             { status: 500 }
//         );
//     }
// }

// // Delete Expense By ID
// export async function DELETE(request, { params }) {
//     try {
//         await connectDb();
//         const { id } = params;

//         if (!id) {
//             return NextResponse.json(
//                 { message: 'Expense ID is required.', success: false },
//                 { status: 400 }
//             );
//         }

//         const deletedExpense = await Expense.findByIdAndDelete(id);
//         if (!deletedExpense) {
//             return NextResponse.json(
//                 { message: 'Expense not found.', success: false },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(
//             { message: 'Expense deleted successfully', success: true },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error('Error deleting expense:', error);
//         return NextResponse.json(
//             { message: 'Failed to delete expense', success: false },
//             { status: 500 }
//         );
//     }
// }





// import { connectDb } from "@/helper/db";
// import Expense from "@/models/Expense";
// import { NextResponse } from "next/server";

// export async function PUT(request, { params }) {
//     try {
//         await connectDb();
//         const { id } = params;
//         const { amount, category, subcategory, description, date } = await request.json();

//         if (!id) {
//             return NextResponse.json(
//                 { message: 'Expense ID is required.', success: false },
//                 { status: 400 }
//             );
//         }

//         const expense = await Expense.findById(id);
//         if (!expense) {
//             return NextResponse.json(
//                 { message: 'Expense not found.', success: false },
//                 { status: 404 }
//             );
//         }

//         expense.amount = amount || expense.amount;
//         expense.category = category || expense.category;
//         expense.subcategory = subcategory || expense.subcategory;
//         expense.description = description || expense.description;
//         expense.date = date || expense.date;

//         const updatedExpense = await expense.save();

//         return NextResponse.json(
//             { message: 'Expense updated successfully', success: true, data: updatedExpense },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error('Error updating expense:', error);
//         return NextResponse.json(
//             { message: 'Failed to update expense', success: false },
//             { status: 500 }
//         );
//     }
// }

// export async function DELETE(request, { params }) {
//     try {
//         await connectDb();
//         const { id } = params;

//         if (!id) {
//             return NextResponse.json(
//                 { message: 'Expense ID is required.', success: false },
//                 { status: 400 }
//             );
//         }

//         const deletedExpense = await Expense.findByIdAndDelete(id);
//         if (!deletedExpense) {
//             return NextResponse.json(
//                 { message: 'Expense not found.', success: false },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(
//             { message: 'Expense deleted successfully', success: true },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error('Error deleting expense:', error);
//         return NextResponse.json(
//             { message: 'Failed to delete expense', success: false },
//             { status: 500 }
//         );
//     }
// }







import { connectDb } from "@/helper/db";
import Expense from "@/models/Expense"; // Note: Changed from "@/models/Expense" to "@/models/expense"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

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
        const { id } = params;
        const { amount, category, subcategory, description, date } = await request.json();

        if (!id) {
            return NextResponse.json(
                { message: 'Expense ID is required.', success: false },
                { status: 400 }
            );
        }

        const expense = await Expense.findOne({
            _id: id,
            userId: session.user.id
        });

        if (!expense) {
            return NextResponse.json(
                { message: 'Expense not found.', success: false },
                { status: 404 }
            );
        }

        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.subcategory = subcategory || expense.subcategory;
        expense.description = description || expense.description;
        expense.date = date || expense.date;

        const updatedExpense = await expense.save();

        return NextResponse.json(
            { message: 'Expense updated successfully', success: true, data: updatedExpense },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating expense:', error);
        return NextResponse.json(
            { message: 'Failed to update expense', success: false },
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
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { message: 'Expense ID is required.', success: false },
                { status: 400 }
            );
        }

        const deletedExpense = await Expense.findOneAndDelete({
            _id: id,
            userId: session.user.id
        });

        if (!deletedExpense) {
            return NextResponse.json(
                { message: 'Expense not found.', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Expense deleted successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting expense:', error);
        return NextResponse.json(
            { message: 'Failed to delete expense', success: false },
            { status: 500 }
        );
    }
}














