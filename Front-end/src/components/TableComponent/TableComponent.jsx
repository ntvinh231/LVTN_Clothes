import { Table } from 'antd';
import React from 'react';
import Loading from '../LoadingComponent/Loading';

const TableComponent = (props) => {
	const { selectionType = 'checkbox', dataTable = [], columns = [], isLoading = false } = props;

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === 'Disabled User',
			// Column configuration not to be checked
			name: record.name,
		}),
	};

	return (
		<Loading isLoading={isLoading}>
			<Table
				rowSelection={{
					type: selectionType,
					...rowSelection,
				}}
				columns={columns}
				dataSource={dataTable}
			/>
		</Loading>
	);
};

export default TableComponent;
