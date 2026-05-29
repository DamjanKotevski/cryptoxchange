function PortfolioModal({
    selectedCoin,
    quantity,
    buyPrice,
    setQuantity,
    setBuyPrice,
    onConfirm,
    onClose
}) {
    if (!selectedCoin) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="custom-modal card p-4">
                <h3>
                    Add {selectedCoin.name} to Portfolio
                </h3>

                <form onSubmit={onConfirm}>
                    <div className="mb-3">
                        <label>Quantity Owned</label>

                        <input
                            type="number"
                            className="form-control"
                            required
                            min="0.0001"
                            step="0.0001"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(e.target.value)
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label>Buy Price</label>

                        <input
                            type="number"
                            className="form-control"
                            required
                            min="0.01"
                            step="0.01"
                            value={buyPrice}
                            onChange={(e) =>
                                setBuyPrice(e.target.value)
                            }
                        />
                    </div>

                    <button className="btn btn-success me-2">
                        Add to Portfolio
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PortfolioModal;