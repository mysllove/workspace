<template>
  <div class="app-container">
    <div class="form-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="单元号">
          <el-input v-model="formInline.unitNumber" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="楼号">
          <el-input v-model="formInline.buildingNo" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="户室">
          <el-input v-model="formInline.familyRoom" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button plain @click="handleCreate">新增房屋</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="单元号" width="250">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="楼号" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.buildingNo }}
        </template>
      </el-table-column>
      <el-table-column label="户室" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.familyRoom }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住人数" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="入住时间" width="280">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="280" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click=" handleUpdate(scope.row)"
          >查看</el-button>
          <el-button
            v-if="scope.row.status!='已注销'"
            size="mini"
            @click="handleModifyStatus(scope.row,'已注销')"
          >处理</el-button>
          <el-button v-if="scope.row.status!='正常'" size="mini" @click="handleModifyStatus(scope.row,'正常')">
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 15, 20]"
      :page-size="100"
      layout="total, prev, pager, next, jumper , sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleAdd" top="1vh">
      <el-form
        ref="temp"
        :model="temp"
        label-position="right"
        label-width="120px"
      >
        <el-row
          :gutter="10"
        >
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="房产证号：" prop="num1">
              <el-input v-model="temp.num1" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="所在市：" prop="num2">
              <el-select v-model="temp.num2" class="filter-item" placeholder="所在市">
                <el-option v-for="item in city" :key="item.key" :label="item.cityAddress" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="单元号：" prop="num3">
              <el-input v-model="temp.num3" placeholder="请输入数字" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="所在区：" prop="num4">
              <el-select v-model="temp.num4" class="filter-item" placeholder="所在区">
                <el-option label="浦东新区" value="pudong" />
                <el-option label="普陀" value="putuo" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="楼号：" prop="num5">
              <el-input v-model="temp.num5" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="所在街道：" prop="num6">
              <el-input v-model="temp.num6" placeholder="浦兴街道" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="户室：" prop="num7">
              <el-input v-model="temp.num7" placeholder="请输入户室" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="所在居委：" prop="num8">
              <el-select v-model="temp.num8" class="filter-item" placeholder="所在居委">
                <el-option label="银桥花园居委会" value="jwh" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="房屋面积：" prop="num9">
              <el-input v-model="temp.num9" placeholder="请输入数字" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="所在小区：" prop="num10">
              <el-select v-model="temp.num10" class="filter-item" placeholder="所在小区">
                <el-option label="银桥花苑" value="jwh" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="房屋用途：" prop="num11">
              <el-select v-model="temp.num11" class="filter-item" placeholder="房屋用途">
                <el-option label="民宅" value="jwh" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="住户数：" prop="num12">
              <el-input v-model="temp.num12" placeholder="请输入数字" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="房屋性质：" prop="num13">
              <el-select v-model="temp.num13" class="filter-item" placeholder="房屋用途">
                <el-option label="住宅" value="jwh" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="入住时间：" prop="date1">
              <el-date-picker v-model="temp.date1" type="datetime" placeholder="点击选择时间" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="房屋类型：" prop="num14">
              <el-select v-model="temp.num14" class="filter-item" placeholder="房屋类型">
                <el-option label="多层" value="jwh" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="入住人姓名：" prop="num15">
              <el-input v-model="temp.num15" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="建成时间：" prop="date3">
              <el-date-picker v-model="temp.date3" type="datetime" placeholder="2016-06-06" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="身份证号：" prop="num16">
              <el-input v-model="temp.num16" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="物业管理：" prop="num17">
              <el-select v-model="temp.num17" class="filter-item" placeholder="房屋类型">
                <el-option label="物业公司" value="jwh" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="联系方式：" prop="num18">
              <el-input v-model="temp.num18" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="12">
            <el-form-item label="状态：" prop="num19">
              <el-select v-model="temp.num19" class="filter-item" placeholder="房屋类型">
                <el-option label="正常" value="jwh" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
        <el-button plain @click="resetForm('temp')">
          重置
        </el-button>
      </div>

    </el-dialog>
    <el-dialog
      title="房屋信息详情"
      width="60%"
      top="1vh"
      center
      breadcrumb="statusValue"
      :visible.sync="dialogFormVisible"
    >
      <tableInfor :info="tempData" :ok="list" />
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import { createArticle } from '@/api/article'
import TableInfor from './components/TableInfor'
const city = [
  { key: '1', cityAddress: '上海市' },
  { key: '2', cityAddress: '杭州市' },
  { key: '3', cityAddress: '武汉市' },
  { key: '4', cityAddress: '北京市' }
]
export default {
  components: { TableInfor },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '正常': 'success',
        '已注销': 'gray'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      tempData: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogFormVisibleAdd: false,
      dialogStatus: '',
      statusValue: '456',
      city,
      textMap: {
        update: 'Edit',
        create: '房屋信息新增'
      },
      currentPage: 1, // 初始页
      pagesize: 10, //    每页的数据
      total: 400,
      temp: {
        num1: '',
        num2: '',
        num3: '',
        num4: '',
        num5: '',
        num6: '',
        num7: '',
        num8: '',
        num9: '',
        num10: '',
        num11: '',
        num12: '',
        num13: '',
        num14: '',
        num15: '',
        num16: '',
        num17: '',
        num18: '',
        num19: '',
        date1: '',
        date2: '',
        date3: ''
      },
      formInline: {
        unitNumber: '',
        buildingNo: '',
        familyRoom: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    resetForm(formName) {
      alert(2)
      this.$refs[formName].resetFields()
    },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
        console.log(this.list)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.tempData = Object.assign({}, row)
      this.statusValue = '详情'
      console.log(this.tempData)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleDelete(row, index) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(row, 1)
        })
        .catch(() => {})
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size
      this.currentPage = 1
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    }
  }
}
</script>
<style>

</style>
