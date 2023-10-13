import type { AdminUser } from '@/types/adminUser.type'

type UserListProps = {
  adminUsers: AdminUser[]
}

export default function UserList({ adminUsers }: UserListProps) {
  return (
    <div className='space-y-5'>
      {adminUsers?.map((admin) => (
        <div
          key={admin.id}
          className='flex gap-24 items-center border p-5 rounded-lg shadow'
        >
          <div>
            <p className='text-slate-500'>Name</p>
            <p className='text-slate-500'>E-Mail</p>
            <p className='text-slate-500'>Rolle</p>
          </div>
          <div>
            <p>{admin.name}</p>
            <p>{admin.email}</p>
            <p>{admin.role}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
