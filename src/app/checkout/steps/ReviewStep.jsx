export default function ReviewStep({
    items,
    totalPrice,
    back,
    next
}) {
    return (
        <div>
            <h2>Review Order</h2>
            {items?.map((item) => (
                <div key={item.id}>
                    <p>{item.title} x {item.quantity}</p>
                </div>
            ))}
            <p>Total: ₹{totalPrice}</p>
            <button onClick={back}>Back</button>
            <button onClick={next}>Confirm</button>
        </div>
    )
}