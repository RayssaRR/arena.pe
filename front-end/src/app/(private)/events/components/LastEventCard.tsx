export default function LastEventCard() {
  return (
    <div className="border rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        {/*Header (Títulos)*/}
        <thead className="text-gray-500 bg-gray-50">
          <tr>
            <th className="px-4 py-3" scope="col">EVENTO</th>
            <th className="px-4 py-3" scope="col">DATA</th>
            <th className="px-4 py-3" scope="col">LOCAL</th>
            <th className="px-4 py-3" scope="col">STATUS</th>
          </tr>
        </thead>

        {/*Dados*/}
        <tbody>
          <tr className="border-t hover:bg-gray-50 transition cursor-pointer">
            <td className="px-4 py-3">Santa Cruz x Figueirense</td>
            <td className="px-4 py-3">OUT 11, 2026</td>
            <td className="px-4 py-3">Arq. Setor Sul</td>
            <td className="px-4 py-3">
              <span className="bg-[#ADE8AD] px-4 py-1 rounded-2xl text-sm font-medium">
                COMPARECEU
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}