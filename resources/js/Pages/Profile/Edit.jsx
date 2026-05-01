import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

    // Deteksi apakah user sedang di halaman admin
    const isAdmin = auth.user?.role === 'admin' || window.location.pathname.startsWith('/admin');

    // Konten utama (shared antara layout admin & user biasa)
    const content = (
        <>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Form Update Profile */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Form Update Password */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Form Delete Account */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </>
    );

    // Jika user adalah admin → gunakan AdminLayout
    if (isAdmin) {
        return (
            <AdminLayout title="Profil" activeTab="profile">
                {content}
            </AdminLayout>
        );
    }

    // User biasa → gunakan AuthenticatedLayout (standar)
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Profile
                </h2>
            }
        >
            {content}
        </AuthenticatedLayout>
    );
}
