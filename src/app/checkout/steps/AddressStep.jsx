export default function AddressStep({ address, setAddress, next }) {
    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        next();
    }


    return (
        <form onSubmit={handleSubmit}>
            <h2>Shipping Address</h2>
            <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={address.fullName}
                onChange={handleChange}
                required />

            <input
                type="text"
                name="phone"
                placeholder="phone"
                value={address.phone}
                onChange={handleChange}
                required />

            <input
                type="text"
                name="street"
                placeholder="Street"
                value={address.street}
                onChange={handleChange}
                required />

            <input
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                required />

            <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleChange}
                required />

            <button type="submit" className=".submit">Continue</button>
        </form>
    )
}