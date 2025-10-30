type DeleteButtonProps = {
    onClick: () => Promise<void>;
};
export default function DeleteButton({ onClick }: DeleteButtonProps) {
    return (
        <button onClick={onClick} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            Delete
        </button>
    );
}