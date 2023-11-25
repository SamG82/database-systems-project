import Popup from "reactjs-popup"
import '../../styles/selector.css'

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
    const selectButton =
        <button className="selector-button">
            {props.selected === undefined ?
            <i className="down-arrow"/> : props.items?.find(item => item?.id === props.selected)?.name}
        </button>
    
    return (
        <div className="popup-selector">
            <h1 className="selector-title">{props.title}</h1>
            <Popup
            trigger={selectButton}
            position={"right center"}
            >
                <div className="selector-list">
                    {props.items?.map((item, idx) => (
                        <div className="selector-item" key={idx} onClick={_ => props.setSelected(item.id)}>
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