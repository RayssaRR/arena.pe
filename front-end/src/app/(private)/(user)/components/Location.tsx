export default function Location() {
  return (
    <div className="space-y-4 mt-4">
      <h3 className="title-h3">Localização</h3>

      <div className="rounded-xl overflow-hidden border shadow-sm">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3991.7445479891758!2d-35.00884125908641!3d-8.04087496726551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab1b1230d5e171%3A0xc7ce009c5bed0f93!2sArena%20de%20Pernambuco!5e1!3m2!1sen!2sbr!4v1779650788554!5m2!1sen!2sbr"
          width="100%"
          height="420"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Arena de Pernambuco"
        />
      </div>

      <div className="space-y-1">
        <p className="font-semibold text-gray-800">Arena de Pernambuco</p>
        <p className="text-sm text-gray-500">
          Av. Deus é Fiel, 1 — Penedo, São Lourenço da Mata, PE, 54710-010
        </p>
      </div>
    </div>
  );
}