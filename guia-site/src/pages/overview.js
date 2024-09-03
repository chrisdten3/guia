//create a new file called overview.js in the pages directory and add the following code:

import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import './overview.css';

const Overview = () => {
    const { currentRepo } = useContext(Context);

    return (
        <div className="overview-container">
            <div className="overview-box">
                <h1 className="overview-title">Overview of {currentRepo}</h1>
            </div>
        </div>
    );
}

export default Overview;
