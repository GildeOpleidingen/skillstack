import type { Session } from "next-auth";


type SidebarProps = {  session: Session;};


export default async function Sidebar( {session} : SidebarProps ) 
{	
	console.log("Sidebar loaded??")

	return(
		<div>Sidebar</div>
	)

}