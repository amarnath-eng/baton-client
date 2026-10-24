import { AcceptInviteCard } from '../features/invitations/AcceptInviteCard.jsx'

export default function AcceptInvitePage() {
  return (
    <main className="min-h-screen min-h-dvh w-full bg-black text-white flex flex-col justify-start sm:justify-center items-center px-4 pt-10 pb-32 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-md my-auto">
        <AcceptInviteCard />
      </div>
    </main>
  )
}
