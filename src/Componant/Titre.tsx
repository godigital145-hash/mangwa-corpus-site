export default function Titre({ titre }: { titre: string }) {
    return (
        <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 mb-4 karma mt-4">
            {titre}
        </h2>
    )
}