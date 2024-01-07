import { Button, Table } from 'antd';
import React, { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { Excel } from 'antd-table-saveas-excel';
import { useMemo } from 'react';
import ModalComponent from '../ModalComponent/ModalComponent';

const TableComponent = (props) => {
	const {
		selectionType = 'checkbox',
		dataTable: dataSource = [],
		columns = [],
		isLoading = false,
		handleDeleteMany,
		isLoadingDeleteMany = false,
	} = props;

	const newColumnExport = useMemo(() => {
		const arr = columns?.filter((col) => col.dataIndex !== 'action');
		return arr;
	}, [columns]);

	const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setRowSelectedKeys(selectedRowKeys);
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === 'Disabled User',
			name: record.name,
		}),
	};

	const handleDeleteAll = () => {
		handleDeleteMany(rowSelectedKeys);
		setIsModalOpenDelete(false);
	};
	const exportExcel = () => {
		const excel = new Excel();
		excel
			.addSheet('test')
			.addColumns(newColumnExport)
			.addDataSource(Array.isArray(dataSource) ? dataSource : [], {
				str2Percent: true,
			})
			.saveAs('Excel.xlsx');
	};

	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

	const handleCancelDelete = () => {
		setIsModalOpenDelete(false);
	};

	return (
		<Loading isLoading={isLoading}>
			{rowSelectedKeys.length > 0 && (
				<div
					style={{
						background: '#1d1ddd',
						color: '#fff',
						fontWeight: 'bold',
						padding: '10px',
						cursor: 'pointer',
						marginBottom: '10px',
					}}
					onClick={() => setIsModalOpenDelete(true)}
				>
					Xóa tất cả
				</div>
			)}
			<ModalComponent
				style={{ textAlign: 'center' }}
				title="Xóa tất cả"
				open={isModalOpenDelete}
				onCancel={handleCancelDelete}
				onOk={handleDeleteAll}
			>
				<Loading isLoading={isLoadingDeleteMany}>
					<div>Bạn có chắc chắn xóa tất cả không?</div>
				</Loading>
			</ModalComponent>
			<Button onClick={exportExcel}>Export excel</Button>
			<Table
				key={dataSource.key}
				rowSelection={{
					type: selectionType,
					...rowSelection,
				}}
				columns={columns}
				dataSource={dataSource}
				{...props}
			/>
		</Loading>
	);
};

export default TableComponent;
