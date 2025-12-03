import { NextResponse } from "next/server";

// هنا حط الصفحات اللي عاوز تحميها
const protectedRoutes = ["/FrontPage"];

export default function middleware(req) {
    // 1. نجيب حالة تسجيل الدخول من الكوكيز (البديل الآمن لـ sessionStatus)
    const verify = req.cookies.get("loggedin");
    
    // بنعتبره مش مسجل لو الكوكي مش موجودة أو قيمتها 'false'
    const isNotLoggedIn = !verify || verify.value === 'false';

    // 2. نتأكد هل إحنا في صفحة محمية ولا لأ
    // استخدمنا some & startsWith عشان لو فيه /FrontPage/dashboard يلقطها برضه
    const isProtectedRoute = protectedRoutes.some(route => 
        req.nextUrl.pathname.startsWith(route)
    );

    // 3. اللوجيك: لو الصفحة محمية + المستخدم مش مسجل دخول -> ارجع لصفحة الدخول
    if (isNotLoggedIn && isProtectedRoute) {
        const absoluteURL = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }

    // 4. ضروري جداً: لو مفيش إعادة توجيه، اسمح بالمرور (عشان ميجبش 500 Error)
    return NextResponse.next();
}

// الـ config عشان الأداء يبقي سريع وميشتغلش على الصور
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
