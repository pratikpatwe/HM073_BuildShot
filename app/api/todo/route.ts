import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { addXp, XP_VALUES } from '@/lib/xp';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter'); // today, upcoming, completed, all
        const label = searchParams.get('label');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const search = searchParams.get('search');

        const query: any = { userId, isDeleted: false };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (filter === 'today') {
            query.date = { $gte: today, $lt: tomorrow };
            query.isCompleted = false;
        } else if (filter === 'upcoming') {
            query.date = { $gte: today };
            query.isCompleted = false;
        } else if (filter === 'completed') {
            query.isCompleted = true;
        } else if (filter === 'prioritize') {
            query.isCompleted = false;
        }

        if (label) {
            query.label = { $regex: label, $options: 'i' };
        }

        if (startDate) {
            query.date = query.date || {};
            query.date.$gte = new Date(startDate);
        }

        if (endDate) {
            query.date = query.date || {};
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.date.$lte = end;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { label: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption: any = { date: 1, priority: -1 };

        if (filter === 'prioritize') {
            // Sort by priority desc, then by deadline proximity
            sortOption = { priority: -1, deadline: 1, date: 1 };
        } else if (filter === 'completed') {
            sortOption = { completedAt: -1 };
        }

        const todos = await Todo.find(query).sort(sortOption).lean();

        // Calculate effective priority based on deadline proximity
        const formattedTodos = todos.map(todo => {
            let effectivePriority = todo.priority;

            if (todo.deadline && !todo.isCompleted) {
                const deadlineDate = new Date(todo.deadline);
                const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                if (daysUntilDeadline <= 0) {
                    effectivePriority = 10; // Overdue
                } else if (daysUntilDeadline <= 1) {
                    effectivePriority = Math.max(effectivePriority, 9);
                } else if (daysUntilDeadline <= 3) {
                    effectivePriority = Math.max(effectivePriority, 8);
                } else if (daysUntilDeadline <= 7) {
                    effectivePriority = Math.max(effectivePriority, 7);
                }
            }

            return {
                id: todo._id.toString(),
                title: todo.title,
                description: todo.description,
                date: todo.date,
                deadline: todo.deadline,
                priority: todo.priority,
                effectivePriority,
                label: todo.label,
                location: todo.location,
                reminder: todo.reminder,
                isCompleted: todo.isCompleted,
                completedAt: todo.completedAt,
                createdAt: todo.createdAt,
                updatedAt: todo.updatedAt,
            };
        });

        // Re-sort by effective priority if prioritize filter
        if (filter === 'prioritize') {
            formattedTodos.sort((a, b) => b.effectivePriority - a.effectivePriority);
        }

        return NextResponse.json({ todos: formattedTodos });
    } catch (error: any) {
        console.error("Todo GET error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;
        const data = await req.json();

        const { title, description, date, deadline, priority, label, location, reminder } = data;

        if (!title?.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }
        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        const todo = await Todo.create({
            userId,
            title: title.trim(),
            description: description?.trim(),
            date: new Date(date),
            deadline: deadline ? new Date(deadline) : undefined,
            priority: priority || 5,
            label: label?.trim(),
            location: location?.trim(),
            reminder: reminder ? new Date(reminder) : undefined,
        });

        return NextResponse.json({
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description,
            date: todo.date,
            deadline: todo.deadline,
            priority: todo.priority,
            label: todo.label,
            location: todo.location,
            reminder: todo.reminder,
            isCompleted: todo.isCompleted,
            createdAt: todo.createdAt,
        });
    } catch (error: any) {
        console.error("Todo POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Todo ID required' }, { status: 400 });
        }

        const data = await req.json();

        if (data.isCompleted === true) {
            data.completedAt = new Date();
        } else if (data.isCompleted === false) {
            data.completedAt = null;
        }

        const todo = await Todo.findOneAndUpdate(
            { _id: id, userId },
            { $set: data },
            { new: true }
        );

        if (!todo) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        // Award XP if completed today and scheduled for today
        if (data.isCompleted === true) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todoDate = new Date(todo.date);
            const todoDay = new Date(todoDate.getFullYear(), todoDate.getMonth(), todoDate.getDate());

            if (todoDay.getTime() === today.getTime()) {
                await addXp(userId, XP_VALUES.TASK_COMPLETE);
            }
        }

        return NextResponse.json({
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description,
            date: todo.date,
            deadline: todo.deadline,
            priority: todo.priority,
            label: todo.label,
            location: todo.location,
            reminder: todo.reminder,
            isCompleted: todo.isCompleted,
            completedAt: todo.completedAt,
            updatedAt: todo.updatedAt,
        });
    } catch (error: any) {
        console.error("Todo PATCH error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Todo ID required' }, { status: 400 });
        }

        const result = await Todo.findOneAndUpdate(
            { _id: id, userId },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Todo DELETE error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
