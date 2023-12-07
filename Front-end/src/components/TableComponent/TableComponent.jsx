import { Table } from 'antd';
import React, { useState } from 'react';
import Loading from '../LoadingComponent/Loading';

const TableComponent = (props) => {
	const { selectionType = 'checkbox', dataTable = [], columns = [], isLoading = false, handleDeleteMany } = props;
	const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setRowSelectedKeys(selectedRowKeys);
			// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === 'Disabled User',
			// Column configuration not to be checked
			name: record.name,
		}),
	};

	const handleDeleteAll = () => {
		handleDeleteMany(rowSelectedKeys);
	};
	return (
		<Loading isLoading={isLoading}>
			{rowSelectedKeys.length > 0 && (
				<div
					style={{ background: '#1d1ddd', color: '#fff', fontWeight: 'bold', padding: '10px', cursor: 'pointer' }}
					onClick={handleDeleteAll}
				>
					Xóa tất cả
				</div>
			)}
			<Table
				key={dataTable.key}
				rowSelection={{
					type: selectionType,
					...rowSelection,
				}}
				columns={columns}
				dataSource={dataTable}
				{...props}
			/>
		</Loading>
	);
};

export default TableComponent;
