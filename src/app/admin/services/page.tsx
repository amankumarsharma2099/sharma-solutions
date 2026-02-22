import { getAdminServices, createService, updateService, deleteService } from "./actions";
import { AdminServicesClient } from "./AdminServicesClient";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getAdminServices();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Management</h1>
          <p className="mt-1 text-slate-600">
            Add, edit, or remove services. Changes reflect on the site.
          </p>
        </div>
      </div>

      <AdminServicesClient
        initialServices={services}
        onCreateService={createService}
        onUpdateService={updateService}
        onDeleteService={deleteService}
      />
    </div>
  );
}
