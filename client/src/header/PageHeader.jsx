function PageHeader( { PageNumber } ) {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                <a className="navbar-brand fw-bold text-danger fs-3" href="/" >Pizza-lo-ji</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className={PageNumber == 1 ? "nav-link active" : "nav-link"} aria-current="page" href="/pizzas/list">Pizzas</a>
                            </li>
                            <li className="nav-item">
                                <a className={PageNumber == 2 ? "nav-link active" : "nav-link"} href="/pizzas/create">Add Pizza</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default PageHeader;