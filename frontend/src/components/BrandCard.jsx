import { Link } from "react-router-dom"

export default function BrandCard({ brand }) {
    return (
        <article className="card brand-card">
            <img src={brand.photo} alt="" className="brand-card__photo" loading="lazy" />
            <div className="card__body">
                <h3 className="card__title">
                    <Link to={`/marcas/${brand._id}`}>{brand.name}</Link>
                </h3>
                <p className="muted clamp">{brand.description}</p>
            </div>
        </article>
    )
}
