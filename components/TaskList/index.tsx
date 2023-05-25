import { Avatar, AvatarGroup, Box, Button, Card, CardContent, Grid, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { calculateRemainingDays } from '../../utils/date';
import ITask from '../../types/task';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function TaskList({ tasks }: { tasks: ITask[] }) {
    const [ID, setID] = useState<null | string>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItem, setSelectedItem] = useState<ITask | null>(null);

    const router = useRouter();

    useEffect(() => {
        setID(window.location.href.split('/')[4]);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, item: ITask) => {
        setAnchorEl(e.currentTarget);
        setSelectedItem(item);
    }

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Typography variant='h5'>Recent Tasks ({tasks.length})</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button component={Link} href={`/`} startIcon={<ArrowBackIcon />} variant="contained" color="primary">Back to projects</Button>
                    <Button component={Link} href={`/projects/${ID}/tasks/create`} startIcon={<AddIcon />} variant="contained" color="primary">New task</Button>
                </Box>
            </Box>
            <Grid container spacing={4} direction="row">
                {tasks.map(task => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={task.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                                        <AccessTimeIcon color="warning" sx={{ fontSize: 12, verticalAlign: 'text-top' }} /> Due in {calculateRemainingDays(task.deadline)} days
                                    </Typography>
                                    <IconButton onClick={(e) => handleClick(e, task)}>
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography variant="h5" component="h3" sx={{ marginTop: 1 }}>{task.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', marginTop: 1 }}>{task.description}</Typography>
                                <AvatarGroup sx={{ justifyContent: 'flex-end', marginTop: 2 }}>
                                    <Tooltip title={task.authorName} arrow>
                                        <Avatar src={task.authorAvatar} alt={task.authorName} sx={{ width: 24, height: 24 }} />
                                    </Tooltip>
                                </AvatarGroup>
                            </CardContent>
                        </Card>
                        <Menu
                            open={Boolean(anchorEl) && selectedItem === task}
                            onClose={handleClose}
                            anchorEl={anchorEl}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    router.push(`/projects/${ID}/tasks/${task.id}/edit`)
                                }}
                            >
                                Edit task
                            </MenuItem>
                        </Menu>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}