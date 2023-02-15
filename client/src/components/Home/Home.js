import React, { useState, useEffect } from 'react'
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import ChipInput from 'material-ui-chip-input'

import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import Pagination from '../Pagination'
import useStyles from './styles'
import { getPostsBySearch } from '../../actions/posts'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

const Home = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [currentId, setCurrentId] = useState(null)
    const navigate = useNavigate()
    const query = useQuery()
    const page = query.get('page') || 1 // 监视着浏览器地址栏的地址是否有page这个参数，有就获取其值，没有就为1
    const searchQuery = query.get('searchQuery') // 监视着浏览器地址栏的地址是否有search这个参数，有就获取其值，没有就没有
    const [search, setSearch] = useState('')
    const [tags, setTags] = useState([]) // [a, b] -> 'a, b'

    // useEffect(() => {
    //     dispatch(getPosts())
    // }, [dispatch])

    const searchPost = () => {
        if (search.trim() || tags) {
            // dispatch(searchAction) -> 获取posts
            // console.log(tags instanceof Array) // Array
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }))
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
        } else {
            navigate('/')
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            // 搜索post
            searchPost()
        }
    }

    const handleAdd = tag => setTags([ ...tags, tag ])
    const handleDelete = tagToDelete => setTags(tags.filter(tag => tag !== tagToDelete))
    return (
        <Grow in>
            <Container maxWidth='xl'>
                <Grid container className={classes.gridContainer} justifyContent='space-between' alignItems='stretch' spacing={3}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                            <TextField name='search' label='搜索' variant='outlined' fullWidth value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
                            <ChipInput
                                style={{ margin: '10px 0' }}
                                value={tags}
                                onAdd={handleAdd}
                                onDelete={handleDelete}
                                label='搜索标签'
                                variant='outlined'
                            />
                            <Button onClick={searchPost} className={classes.appBarSearch} color='primary' variant='contained'>搜索</Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        {(!searchQuery && !tags.length) && (
                            <Paper elevation={6} className={classes.pagination}>
                                <Pagination page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}

export default Home