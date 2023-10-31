import "../../styles/itemgrid.css"
import React, { Children } from "react"

type Props = {
    features: Array<string>,
    dataItems: Array<string>[]
}

function ItemsList(props: React.PropsWithChildren<Props>) {

    const createItems = props.dataItems.map((arr, _) => {
        const subItem = arr.map((item, _) => {
            return <span>{item}</span>
        })

        return <>{subItem}{props.children}</>
    })

    const columnCount = props.features.length + Children.count(props.children)

    return (
        <div style={{gridTemplateColumns: `repeat(${columnCount}, 1fr)`}} className="list-items">
            {props.features.map((value, idx) => (
                <span key={idx} className="column-title">{value}</span>
            ))}

            {/* placeholders */}
            {Children.map(props.children, _ => <span/>)}
            
            {createItems}
        </div>
    )
}

export default ItemsList