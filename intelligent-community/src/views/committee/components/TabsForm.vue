<template>
  <div>
    <search-form
      :form-config="formConfig"
      :value="form"
      @showDialog="showAddFundDialog"
      @showDialog2="showAddFundDialog2"
    />
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        v-for="items in tableDataType"
        :key="items.id"
        table-data-type-
        :prop="items.nameProp"
        :label="items.nameLable"
        align="center"
        width="180"
      />

      <!-- <el-table-column
        prop="ID"
        label="tableData.unit"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column
        prop="provinces"
        label="法人代表"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.representative }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderMoney"
        label="资质证书号"
        align="center"
        width="200"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column
        prop="incomeMoney"
        label="资质等级"
        align="center"
        width="120"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.rank }}
        </template>
      </el-table-column>
      <el-table-column
        prop="payType"
        label="物业经理"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.manager }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderPeriod"
        label="电话"
        align="center"
        width="250"
      >
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column> -->
      <el-table-column
        prop="operation"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            icon="edit"
            size="mini"
            @click="handleUpdate(scope.row,scope.$index)"
          >查看</el-button>
          <el-button size="mini" @click="handleModifyStatus(scope.row)">
            修改
          </el-button>
          <el-button
            type="danger"
            icon="delete"
            size="mini"
            @click="onDeleteMoney(scope.row,scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="100"
      layout="total, prev, pager, next, jumper , sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <addFundDialog v-if="addFundDialog.show" :is-show="addFundDialog.show" @closeDialog="hideAddFundDialog" />
    <addFundDialogA v-if="addFundDialog2.show" :is-show="addFundDialog2.show" @closeDialog="hideAddFundDialog" />
    <el-dialog
      :title="textMap[dialogStatus]"
      width="60%"
      top="1vh"
      center
      breadcrumb="statusValue"
      :visible.sync="dialogFormVisible"
    >
      <tableInfor :info="rows" />
    </el-dialog>
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import AddFundDialog from './addFundDialog'
import AddFundDialogA from './addFundDialogA'
import TableInfor from './TableInfor'
import formDatas from '../formDatas/tabForm.json'

export default {
  components: {
    searchForm, AddFundDialog, TableInfor, AddFundDialogA
  },
  props: {
    toggleData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      textMap: {
        update: '人员信息详情',
        create: '物业信息详情'
      },
      formConfig: {},
      tableData: [],
      form: {},
      rows: {},
      currentPage: 1, // 初始页
      pagesize: 10, //    每页的数据
      total: 400,
      isShow: false,
      dialogFormVisible: false,
      addFundDialog: {
        show: false,
        dialogRow: {}
      },
      addFundDialog2: {
        show: false,
        dialogRow: {}
      },
      tableDataType: [],
      tableDataType1: [
        {
          nameLable: '单位名称',
          nameProp: 'item1'
        }, {
          nameLable: '法人代表',
          nameProp: 'item2'

        }, {
          nameLable: '资质证书号',
          nameProp: 'item7'
        },
        {
          nameLable: '资质等级',
          nameProp: 'item9'
        },
        {
          nameLable: '物业经理',
          nameProp: 'item2'
        },
        {
          nameLable: '电话',
          nameProp: 'item4'
        }
      ],
      tableDataType2: [
        {
          nameLable: '人员姓名',
          nameProp: 'item1'
        }, {
          nameLable: '状态',
          nameProp: 'item16'

        }, {
          nameLable: '户口类型',
          nameProp: 'item9'
        },
        {
          nameLable: '文化程度',
          nameProp: 'item6'
        },
        {
          nameLable: '身份证号',
          nameProp: 'item2'
        },
        {
          nameLable: '电话',
          nameProp: 'item10'
        }
      ]
    }
  },
  watch: {
    // 监听属性的变化，可以接收参数;
    toggleData(v) {
      this.showTableData(v)
      console.log(v)
    }
  },

  methods: {
    showAddFundDialog() {
      this.addFundDialog.show = true
    },
    showAddFundDialog2() {
      this.addFundDialog2.show = true
    },
    hideAddFundDialog() {
      this.addFundDialog.show = false
      this.addFundDialog2.show = false
    },
    showTableData(item) {
      switch (item) {
        case 'propertyManagement':
          this.formConfig = formDatas.committee.formConfig
          this.tableData = formDatas.committee.propertyManagement
          this.total = formDatas.committee.propertyManagement.length
          this.tableDataType = this.tableDataType1
          break
        case 'personnelManagement':
          this.formConfig = formDatas.personnel.formConfig
          this.tableData = formDatas.personnel.personnelManagement
          this.tableDataType = this.tableDataType2
          break
      }
    },
    handleUpdate(row, index) {
      this.dialogFormVisible = true
      this.rows = row
      if (this.tableDataType === this.tableDataType2) {
        this.dialogStatus = 'update'
      } else {
        this.dialogStatus = 'create'
      }
    },
    onDeleteMoney(row) {
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
          this.tableData.splice(row, 1)
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
