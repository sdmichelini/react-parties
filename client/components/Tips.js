/*
    Displays Tips to the user
*/
import React from 'react';

const PARTY_LIST_TIPS = [
    {name:'Multiple Guests', text:`
        You can add multiple guests to the list at once by seperating there names with a comma.
        Guests added this way must be of the same gender.
    `}
];

class TipsComponent extends React.Component {
    render() {
        return (
            <div className='alert alert-info'>
                <strong>{ this.props.tips[0].name }</strong>
                <p>
                    { this.props.tips[0].text }
                </p>
            </div>
        )
    }
}

export { PARTY_LIST_TIPS };
export default TipsComponent;

