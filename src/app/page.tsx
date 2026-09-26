import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Roadmap from "@/components/Roadmap";
import AssignmentProfile from "@/components/AssignmentProfile";

export default async function Home() {
        // Do authentication (see uhm auth.ts)
        const session = await auth();

        // Redirect user when no session
        if (!session?.user) {
                redirect("/login");
        }

        return (
                <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                        <main className="flex flex-1 w-full max-w-3xl flex-col bg-white dark:bg-black sm:items-start">
                                Components:
                                <Sidebar session={session} />
                                <Roadmap />
                                <AssignmentProfile />
                                Pages:
                                <a href="/roadmap">Roadmap link to page</a>
                        </main>
                </div>
        );
}
