import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { useState } from 'react';

export default function ComponentMenu({componentVisibility, setComponentVisibility}) {
    const toggleMarkerBrowser = () => {
        setComponentVisibility(prevState => ({
            ...prevState,
            markerBrowser: !prevState.markerBrowser
        }));
    };
    
    const toggleSearchbar = () => {
        setComponentVisibility(prevState => ({
            ...prevState,
            searchbar: !prevState.searchbar
        }));
    }
    
    const toggleNavigationBar = () => {
        setComponentVisibility(prevState => ({
            ...prevState,
            navigationBar: !prevState.navigationBar
        }));
    }
    
    const togglePositionalInfo = () => {
        setComponentVisibility(prevState => ({
            ...prevState,
            positionalInfo: !prevState.positionalInfo
        }));
    }

    const toggleMenu = () => {setComponentVisibility(prevState => ({
            ...prevState,
            componentMenu: !prevState.componentMenu
        }))
    }

    return (
        <div className="mui-component-menu">
            {componentVisibility.componentMenu ? 
                (<ArrowCircleLeftOutlinedIcon onClick={toggleMenu} className='arrow-icon'/>) 
                : 
                (<ArrowCircleRightOutlinedIcon onClick={toggleMenu} className='arrow-icon'/>)
            }

            {componentVisibility.componentMenu ? (
                <MenuList sx={{padding: 0, margin: 0}}>
                    <MenuItem onClick={toggleMarkerBrowser} disableGutters={true} sx={{paddingLeft: 1, paddingRight: 1}}>
                        {componentVisibility.markerBrowser ? (<VisibilityIcon className='visibility-icon'/>) : (<VisibilityOffIcon/>)}
                        <Typography variant="inherit" noWrap fontSize={13} fontFamily={'monospace'} sx={{marginLeft: 1}}> Marker Browser </Typography>
                    </MenuItem>

                    <MenuItem onClick={toggleSearchbar} disableGutters={true} sx={{paddingLeft: 1, paddingRight: 1}}> 
                        {componentVisibility.searchbar ? (<VisibilityIcon/>) : (<VisibilityOffIcon/>)}
                        <Typography variant="inherit" noWrap fontSize={13} fontFamily={'monospace'} sx={{marginLeft: 1}}> Searchbar </Typography>
                    </MenuItem>

                    <MenuItem onClick={togglePositionalInfo} disableGutters={true} sx={{paddingLeft: 1, paddingRight: 1}}>
                        {componentVisibility.positionalInfo ? (<VisibilityIcon/>) : (<VisibilityOffIcon/>)}
                        <Typography variant="inherit" noWrap fontSize={13} fontFamily={'monospace'} sx={{marginLeft: 1}}> Positional Info </Typography>
                    </MenuItem>

                    <MenuItem onClick={toggleNavigationBar} disableGutters={true} sx={{paddingLeft: 1, paddingRight: 1}}>
                        {componentVisibility.navigationBar ? (<VisibilityIcon/>) : (<VisibilityOffIcon/>)}
                        <Typography variant="inherit" noWrap fontSize={13} fontFamily={'monospace'} sx={{marginLeft: 1}}> Navigation </Typography>
                    </MenuItem>
                </MenuList>
            ) : null}

        </div>
  );
}
