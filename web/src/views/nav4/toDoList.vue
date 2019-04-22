<template>
    <div>
        <el-col :span="12" class="toolbar" style="margin-left: 20%;text-align: center">
            <h1>ToDoList</h1>
        </el-col>

        <el-col :span="12" class="toolbar" style="margin-left: 20%">
            <el-input placeholder="回车添加待办事项" class="todoinput" @keyup.enter.native="add" v-model="newtodo.content"></el-input>
            <p style="font-weight: bold">进行中：{{ todolist.length }} 已完成：{{ donenum }}</p>
            <el-row  v-for="(item, index) in todolist" :key="String(item)" class="list-row">
                <el-col :xs="2" :sm="1" :md="1" :lg="1" :xl="1" class="check" :class="{ red: !todolist[index].done, green: todolist[index].done }">
                    <el-checkbox size="mini" v-model="item.done"></el-checkbox>
                </el-col>
                <el-col :xs="20" :sm="22" :md="22" :lg="22" :xl="22">
                    <input type="text" v-model="item.content" class="ipcont" :class="{done: todolist[index].done}">
                </el-col>
                <el-col :xs="2" :sm="1" :md="1" :lg="1" :xl="1" class="close">
                    <i class="el-icon-close" @click="del(index)"></i>
                </el-col>
            </el-row>
        </el-col>
    </div>
</template>
<script>
export default {
    data () {
        return {
            newtodo: {
                content: '',
                done: false
            },
            todolist: this.fetch(),
            STORAGE_KEY: 'todolist'
        }
    },
    methods: {
        add: function () {
            if (this.newtodo.content) {
                this.todolist.push(this.newtodo);
                this.newtodo = { content: '', done: false }
            }
        },
        del: function (index) {
            this.todolist.splice(index, 1)
        },
        fetch: function () {
            return JSON.parse(window.localStorage.getItem('todolist') || '[]')
        },
        save: function (items) {
            window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items))
        }
    },
    computed: {
        donenum: function () {
            return this.todolist.filter(function (val) { return val.done }).length
        }
    },
    watch: {
        todolist: {
            handler (items) {
                this.save(items)
            },
            deep: true
        }
    },
    mounted () {
        this.fetch();
    }
}

</script>
<style>
    /*#FBFBFB #B9E1DC   #F38181  #756C83 */

    #app {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        color: #756C83;
    }

    .el-header {
        text-align: center;
    }

    .todoinput {
        margin-bottom: 20px;
    }

    .list-row {
        height: 40px;
        background-color: #fbfbfb;
        margin-bottom: 5px;
    }

    .check {
        text-align: center;
        line-height: 40px;
    }

    .red {
        border-left: #ef5f65 2px solid;
    }

    .green {
        border-left: #B9E1DC 2px solid;
    }

    .ipcont {
        width: 90%;
        margin-top: 8px;
        border: 0;
        line-height: 24px;
        background-color: transparent;
        font-size: 16px;
        color: #756C83;
    }

    .close {
        text-align: center;
        line-height: 40px;
    }

    .el-icon-close {
        cursor: pointer;
    }

    .el-icon-close:hover {
        color: #ef5f65;
    }

    .done {
        text-decoration: line-through;
    }
</style>
