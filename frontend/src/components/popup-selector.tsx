import Popup from "reactjs-popup"
import '../../styles/selector.css'
import { useState } from "react"

type selectable = {
    id: number
    name: string
    features: {[key: string]: string | number}

}

type props = {
    title: string
    selected: number | undefined
    items: Array<selectable> | undefined
    setSelected: Function
}

function PopupSelector(props: props) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    
    const onChoiceClick = (item: selectable) => {
        props.setSelected(item.id)
        setIsOpen(false)
    }
    return (
        <div className="popup-selector">
            <h1 className="selector-title">{props.title}</h1>
            <button onClick={_ => setIsOpen(true)} className="selector-button">
                {props.selected === undefined ?
                <i className="down-arrow"/> : props.items?.find(item => item?.id === props.selected)?.name}
            </button>
            <Popup
            onClose={_ => setIsOpen(false)}
            position={"right center"}
            open={isOpen}
            >
                <div className="selector-list">
                    {props.items?.map((item, idx) => (
                        <div className="selector-item" key={idx} onClick={_ => onChoiceClick(item)}>
                            <h1>{item.name}</h1>
                            {Object.keys(item.features).map((key, _) => (
                                <h2>{key}: {item.features[key]}</h2>
                            ))}
                        </div>
                    ))}
                </div>
            </Popup>
        </div>
    )
}

export default PopupSelector